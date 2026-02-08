import { Examples, Footer, Hero, QuickStart, WhyNot } from "./components";

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
