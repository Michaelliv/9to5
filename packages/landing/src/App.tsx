import { Hero, WhyNot, Examples, QuickStart, Footer } from "./components";

export default function App() {
	return (
		<div className="min-h-screen bg-bg-deep">
			<Hero />
			<WhyNot />
			<Examples />
			<QuickStart />
			<Footer />
		</div>
	);
}
