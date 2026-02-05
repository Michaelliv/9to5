import { Box, Text, useInput } from "ink";
import { useState } from "react";
import { AutomationList } from "./components/AutomationList.tsx";
import { Inbox } from "./components/Inbox.tsx";
import { RunHistory } from "./components/RunHistory.tsx";

type Tab = "automations" | "runs" | "inbox";

const TABS: { key: Tab; label: string }[] = [
	{ key: "automations", label: "Automations" },
	{ key: "runs", label: "Runs" },
	{ key: "inbox", label: "Inbox" },
];

export function App() {
	const [activeTab, setActiveTab] = useState<Tab>("automations");

	useInput((input, key) => {
		if (input === "1") setActiveTab("automations");
		if (input === "2") setActiveTab("runs");
		if (input === "3") setActiveTab("inbox");
		if (input === "q" || (key.ctrl && input === "c")) {
			process.exit(0);
		}
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1}>
				<Text bold>9to5</Text>
				<Text> — </Text>
				{TABS.map((tab, i) => (
					<Text key={tab.key}>
						{i > 0 ? " | " : ""}
						<Text
							bold={activeTab === tab.key}
							underline={activeTab === tab.key}
						>
							[{i + 1}] {tab.label}
						</Text>
					</Text>
				))}
				<Text dimColor> (q to quit)</Text>
			</Box>

			{activeTab === "automations" && <AutomationList />}
			{activeTab === "runs" && <RunHistory />}
			{activeTab === "inbox" && <Inbox />}
		</Box>
	);
}
