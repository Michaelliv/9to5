export type AutomationStatus = "active" | "paused";
export type RunStatus = "pending" | "running" | "completed" | "failed";

export interface Automation {
	id: string;
	name: string;
	prompt: string;
	status: AutomationStatus;
	next_run_at: number | null;
	last_run_at: number | null;
	cwd: string;
	rrule: string | null;
	model: string;
	max_budget_usd: number | null;
	allowed_tools: string | null;
	system_prompt: string | null;
	created_at: number;
	updated_at: number;
}

export interface Run {
	id: string;
	automation_id: string;
	status: RunStatus;
	session_id: string | null;
	output: string | null;
	error: string | null;
	result: string | null;
	cost_usd: number | null;
	duration_ms: number | null;
	num_turns: number | null;
	started_at: number | null;
	completed_at: number | null;
	created_at: number;
}

export interface InboxItem {
	id: string;
	title: string | null;
	summary: string | null;
	run_id: string | null;
	read_at: number | null;
	created_at: number;
}
