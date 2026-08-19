import json
import subprocess

BOARD = "magma-blog-run1"
ROOT = "/home/user/.hermes/workspace/magma-content-site"
ITEMS = [
    (".kanban-title-1.txt", ".kanban-card-1.md", "ethan", [], "summer-resort-top5-planning-v1"),
    (".kanban-title-2.txt", ".kanban-card-2.md", "oliver", ["grounded-citations"], "summer-resort-top5-research-v1"),
    (".kanban-title-3.txt", ".kanban-card-3.md", "noah", ["humanizer"], "summer-resort-top5-writing-v1"),
    (".kanban-title-4.txt", ".kanban-card-4.md", "mia", ["visual-design-artifacts", "bk-design"], "summer-resort-top5-visual-v1"),
    (".kanban-title-5.txt", ".kanban-card-5.md", "noah", [], "summer-resort-top5-publish-v1"),
]

def run(args):
    result = subprocess.run(args, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError("Command failed: " + repr(args) + "\n" + result.stdout + "\n" + result.stderr)
    return result.stdout

def task_id_from(result):
    data = json.loads(result)
    task = data.get("task", data.get("data", data))
    task_id = task.get("id") or task.get("task_id")
    if not task_id:
        raise RuntimeError("No task id in response: " + result)
    return str(task_id)

ids = []
for title_file, body_file, assignee, skills, idempotency_key in ITEMS:
    with open(ROOT + "/" + title_file) as file:
        title = file.read().strip()
    with open(ROOT + "/" + body_file) as file:
        body = file.read()
    command = [
        "hermes", "kanban", "--board", BOARD, "create", title,
        "--body", body,
        "--assignee", assignee,
        "--workspace", "dir:" + ROOT,
        "--created-by", "ethan",
        "--max-retries", "1",
        "--idempotency-key", idempotency_key,
        "--json",
    ]
    if ids:
        command += ["--parent", ids[-1]]
    for skill in skills:
        command += ["--skill", skill]
    ids.append(task_id_from(run(command)))

run([
    "hermes", "kanban", "--board", BOARD, "schedule", ids[0],
    "Awaiting owner start decision",
])

verified = []
for task_id in ids:
    verified.append(json.loads(run([
        "hermes", "kanban", "--board", BOARD, "show", task_id, "--json",
    ])))

print(json.dumps({"ids": ids, "tasks": verified}, ensure_ascii=False, indent=2))
