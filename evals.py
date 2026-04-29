"""
Workforce Digest — Eval Suite (Golden Test Cases)
==================================================

Run with:    python3 evals.py
"""

from dataclasses import dataclass, field
from typing import Optional
import json


def detect_leave_anomaly(team_data):
    if team_data["team_size"] < 6:
        return None
    if team_data.get("company_holiday_week", False):
        return None
    out_pct = (team_data["on_leave"] / team_data["team_size"]) * 100
    baseline = team_data["baseline_pct"]
    stdev = team_data["stdev_pct"]
    delta = out_pct - baseline
    z_score = delta / stdev if stdev > 0 else 0
    if z_score >= 2.0 and delta >= 5.0:
        return {
            "signal": "leave_anomaly",
            "severity": "high" if z_score >= 3 else "medium",
            "out_pct": round(out_pct, 1),
            "baseline_pct": baseline,
        }
    return None


def detect_onboarding_stall(employee_data):
    if employee_data["tenure_days"] < 3:
        return None
    if employee_data.get("on_pto", False):
        return None
    gap = employee_data["cohort_avg_pct"] - employee_data["completion_pct"]
    persistence = employee_data["days_below_threshold"]
    if gap >= 25 and persistence >= 5:
        return {
            "signal": "onboarding_stall",
            "severity": "high" if gap >= 40 else "medium",
            "gap_pp": gap,
            "persistence_days": persistence,
        }
    return None


def detect_engagement_drop(team_data):
    if team_data.get("near_holiday", False):
        return None
    score_drop_pct = (team_data["baseline_score"] - team_data["current_score"]) / team_data["baseline_score"]
    has_silent_individual = team_data["max_silent_days"] >= 7
    has_pto_explanation = team_data["users_on_pto"] >= team_data["silent_users"]
    if score_drop_pct >= 0.25 and has_silent_individual and not has_pto_explanation:
        return {
            "signal": "engagement_drop",
            "severity": "high" if score_drop_pct >= 0.40 else "medium",
            "drop_pct": round(score_drop_pct * 100, 1),
            "silent_days": team_data["max_silent_days"],
        }
    return None


@dataclass
class TestCase:
    id: str
    name: str
    description: str
    detector: str
    input_data: dict
    expected_signal: Optional[str]
    expected_severity: Optional[str] = None
    rationale: str = ""
    tests: list = field(default_factory=list)


def run_detector(name, data):
    detectors = {
        "leave_anomaly": detect_leave_anomaly,
        "onboarding_stall": detect_onboarding_stall,
        "engagement_drop": detect_engagement_drop,
    }
    return detectors[name](data)


def evaluate(test_case):
    actual = run_detector(test_case.detector, test_case.input_data)
    if test_case.expected_signal is None:
        passed = actual is None
        actual_str = "no alert" if actual is None else f"fired: {actual['signal']}"
        expected_str = "no alert"
    else:
        if actual is None:
            passed = False
            actual_str = "no alert (false negative)"
        elif actual["signal"] != test_case.expected_signal:
            passed = False
            actual_str = f"fired: {actual['signal']} (wrong signal)"
        elif test_case.expected_severity and actual.get("severity") != test_case.expected_severity:
            passed = False
            actual_str = f"fired: {actual['signal']} ({actual['severity']}, expected {test_case.expected_severity})"
        else:
            passed = True
            actual_str = f"fired: {actual['signal']} ({actual.get('severity', '-')})"
        expected_str = f"{test_case.expected_signal} ({test_case.expected_severity or '-'})"
    return {
        "id": test_case.id, "name": test_case.name, "description": test_case.description,
        "detector": test_case.detector, "passed": passed,
        "expected": expected_str, "actual": actual_str,
        "rationale": test_case.rationale, "tests": test_case.tests,
    }


GOLDEN_TESTS = [
    TestCase(id="LEAVE-01", name="Real coverage spike",
        description="Engineering team, 6 of 22 out (27%), baseline 12%, stdev 4pp.",
        detector="leave_anomaly",
        input_data={"team_size": 22, "on_leave": 6, "baseline_pct": 12.0, "stdev_pct": 4.0},
        expected_signal="leave_anomaly", expected_severity="high",
        rationale="Crosses both gates: z=3.75 (>=3sigma -> high), delta=15pp (>=5pp).",
        tests=["statistical gate", "operational gate", "severity escalation"]),
    TestCase(id="LEAVE-02", name="Tiny-team noise (suppress)",
        description="Founding team of 4, 1 out (25%).",
        detector="leave_anomaly",
        input_data={"team_size": 4, "on_leave": 1, "baseline_pct": 5.0, "stdev_pct": 3.0},
        expected_signal=None,
        rationale="Team size < 6. Must NOT fire.",
        tests=["minimum team size", "false-positive prevention"]),
    TestCase(id="LEAVE-03", name="Statistical-only spike (suppress)",
        description="Stable team (baseline 2%, stdev 0.5pp), 2 of 50 out (4%).",
        detector="leave_anomaly",
        input_data={"team_size": 50, "on_leave": 2, "baseline_pct": 2.0, "stdev_pct": 0.5},
        expected_signal=None,
        rationale="Statistical gate passes (z=4) but operational gate fails (delta=2pp, <5pp floor).",
        tests=["dual-gate logic", "absolute floor enforcement"]),
    TestCase(id="LEAVE-04", name="Holiday suppression",
        description="Same data as LEAVE-01, but Thanksgiving week.",
        detector="leave_anomaly",
        input_data={"team_size": 22, "on_leave": 6, "baseline_pct": 12.0, "stdev_pct": 4.0, "company_holiday_week": True},
        expected_signal=None,
        rationale="Calendar-aware suppression.",
        tests=["calendar suppression"]),
    TestCase(id="ONBOARD-01", name="Clear stall - Jordan scenario",
        description="Day 12, completion 40%, cohort avg 85%, persistent for 7 days.",
        detector="onboarding_stall",
        input_data={"tenure_days": 12, "completion_pct": 40, "cohort_avg_pct": 85, "days_below_threshold": 7},
        expected_signal="onboarding_stall", expected_severity="high",
        rationale="Gap 45pp (>=25), persistence 7 days (>=5). High because gap >=40pp.",
        tests=["primary detection"]),
    TestCase(id="ONBOARD-02", name="Day-2 hire - grace period",
        description="New hire at day 2.",
        detector="onboarding_stall",
        input_data={"tenure_days": 2, "completion_pct": 10, "cohort_avg_pct": 60, "days_below_threshold": 2},
        expected_signal=None,
        rationale="Grace period (first 3 days).",
        tests=["grace period"]),
    TestCase(id="ONBOARD-03", name="Stall during new-hire PTO",
        description="Day 14, on PTO for 6 days.",
        detector="onboarding_stall",
        input_data={"tenure_days": 14, "completion_pct": 30, "cohort_avg_pct": 80, "days_below_threshold": 6, "on_pto": True},
        expected_signal=None,
        rationale="Paused during PTO.",
        tests=["PTO suppression"]),
    TestCase(id="ENGAGE-01", name="Real disengagement",
        description="Team score 51 (baseline 78), one designer silent for 9 days, no PTO.",
        detector="engagement_drop",
        input_data={"baseline_score": 78, "current_score": 51, "max_silent_days": 9, "silent_users": 2, "users_on_pto": 0},
        expected_signal="engagement_drop", expected_severity="medium",
        rationale="All three gates pass. Medium because drop < 40%.",
        tests=["triple-gate logic"]),
    TestCase(id="ENGAGE-02", name="Team-wide drop, no individual silence (suppress)",
        description="Team score down 30%, every individual still active.",
        detector="engagement_drop",
        input_data={"baseline_score": 80, "current_score": 56, "max_silent_days": 3, "silent_users": 0, "users_on_pto": 0},
        expected_signal=None,
        rationale="No individual silence >= 7 days. Likely deep-work mode.",
        tests=["multi-signal confirmation", "false-positive prevention"]),
    TestCase(id="ENGAGE-03", name="Drop fully explained by PTO (suppress)",
        description="Two silent users, both on PTO.",
        detector="engagement_drop",
        input_data={"baseline_score": 80, "current_score": 56, "max_silent_days": 8, "silent_users": 2, "users_on_pto": 2},
        expected_signal=None,
        rationale="Silence fully explained by PTO.",
        tests=["PTO explanation gate"]),
]


def run_all():
    return [evaluate(tc) for tc in GOLDEN_TESTS]


def print_report(results):
    passed = sum(1 for r in results if r["passed"])
    total = len(results)
    print("=" * 64)
    print("  WORKFORCE DIGEST - EVAL SUITE")
    print("=" * 64)
    print(f"\n  {passed} of {total} tests passed ({passed*100//total}%)\n")
    by_detector = {}
    for r in results:
        by_detector.setdefault(r["detector"], []).append(r)
    for detector, items in by_detector.items():
        d_passed = sum(1 for i in items if i["passed"])
        print(f"  {detector.upper()}  ({d_passed}/{len(items)} passed)")
        print("  " + "-" * 60)
        for r in items:
            mark = "PASS" if r["passed"] else "FAIL"
            print(f"    [{mark}]  [{r['id']}]  {r['name']}")
            if not r["passed"]:
                print(f"           expected: {r['expected']}")
                print(f"           actual:   {r['actual']}")
        print()


if __name__ == "__main__":
    results = run_all()
    print_report(results)
    with open("eval_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print(f"  Results exported to eval_results.json")
