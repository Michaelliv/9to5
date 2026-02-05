import type { Automation, Run } from "@9to5/core";
import { Box, Text, useApp, useInput } from "ink";
import { useState } from "react";
import { AutomationDetail } from "./components/AutomationDetail.tsx";
import { AutomationList } from "./components/AutomationList.tsx";
import { Inbox } from "./components/Inbox.tsx";
import { RunDetail } from "./components/RunDetail.tsx";
import { RunHistory } from "./components/RunHistory.tsx";

type Tab = "automations" | "runs" | "inbox";

type DetailView =
	| { type: "automation"; automation: Automation }
	| { type: "run"; run: Run; automationName?: string };

const TABS: { key: Tab; label: string; num: string }[] = [
	{ key: "automations", label: "Automations", num: "1" },
	{ key: "runs", label: "Runs", num: "2" },
	{ key: "inbox", label: "Inbox", num: "3" },
];

export function App() {
	const { exit } = useApp();
	const [activeTab, setActiveTab] = useState<Tab>("automations");
	const [detail, setDetail] = useState<DetailView | null>(null);

	const inList = detail === null;

	useInput((input, key) => {
		if (key.escape && detail) {
			setDetail(null);
			return;
		}

		if (inList) {
			if (input === "1") setActiveTab("automations");
			if (input === "2") setActiveTab("runs");
			if (input === "3") setActiveTab("inbox");
			if (input === "q") exit();
		}
	});

	return (
		<Box flexDirection="column">
			{/* Header */}
			<Box flexDirection="column">
				<Box paddingX={1} gap={1}>
					<Text color="magenta" bold>
						{"◆ 9to5"}
					</Text>
					<Text dimColor>│</Text>
					{TABS.map((tab) => {
						const active = activeTab === tab.key;
						return (
							<Box key={tab.key} marginRight={1}>
								<Text dimColor={!active} color={active ? "cyan" : undefined}>
									{active ? "▸ " : "  "}
								</Text>
								<Text
									bold={active}
									color={active ? "cyan" : undefined}
									dimColor={!active}
								>
									{tab.num} {tab.label}
								</Text>
							</Box>
						);
					})}
				</Box>
				<Text dimColor>{"─".repeat(60)}</Text>
			</Box>

			{/* Content */}
			<Box flexDirection="column" paddingX={1} paddingTop={1}>
				{detail ? (
					detail.type === "automation" ? (
						<AutomationDetail automation={detail.automation} />
					) : (
						<RunDetail
							run={detail.run}
							automationName={detail.automationName}
						/>
					)
				) : (
					<>
						{activeTab === "automations" && (
							<AutomationList
								isActive={inList && activeTab === "automations"}
								onOpenDetail={setDetail}
							/>
						)}
						{activeTab === "runs" && (
							<RunHistory
								isActive={inList && activeTab === "runs"}
								onOpenDetail={setDetail}
							/>
						)}
						{activeTab === "inbox" && (
							<Inbox
								isActive={inList && activeTab === "inbox"}
								onOpenDetail={setDetail}
							/>
						)}
					</>
				)}
			</Box>
		</Box>
	);
}
