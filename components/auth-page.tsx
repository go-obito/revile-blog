"use client";

import { AppleIcon } from "@/components/apple-icon";
import { GithubIcon } from "@/components/github-icon";
import { GoogleIcon } from "@/components/google-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { AuthDivider } from "@/components/auth-divider";
import { FloatingPaths } from "@/components/floating-paths";
import { ChevronLeftIcon, AtSignIcon, LockKeyholeIcon } from "lucide-react";

export type AuthPageVariant = "login" | "signup";

export function AuthPage({
	variant = "login",
	action = "/api/auth/login",
	switchHref = "/admin/signup",
	switchLabel = "Create an account",
	submitLabel = "Sign in",
	title = "Welcome back",
	subtitle = "Sign in to access the Revile newsroom dashboard.",
}: {
	variant?: AuthPageVariant;
	action?: string;
	switchHref?: string;
	switchLabel?: string;
	submitLabel?: string;
	title?: string;
	subtitle?: string;
}) {
	const isSignup = variant === "signup";
	const hiddenRedirect = isSignup ? "/admin" : "/admin";

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			<div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
				<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
				<Logo className="mr-auto h-4.5" />

				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl text-slate-900">
							&ldquo;Revile helps our editorial team move faster, publish smarter, and keep every story on track.&rdquo;
						</p>
						<footer className="font-mono font-semibold text-sm text-slate-700">
							~ Revile editorial desk
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center px-8">
				<div
					aria-hidden
					className="absolute inset-0 isolate -z-10 opacity-60 contain-strict"
				>
					<div className="absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
					<div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
					<div className="absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
				</div>
				<Button className="absolute top-7 left-5" variant="ghost" render={<a href="/" />} nativeButton={false}><ChevronLeftIcon data-icon="inline-start" />Home</Button>

				<div className="mx-auto w-full space-y-4 sm:max-w-md">
					<Logo className="h-4.5 lg:hidden" />
					<div className="flex flex-col space-y-1">
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Admin access</p>
						<h1 className="font-bold text-2xl tracking-wide text-slate-900">
							{title}
						</h1>
						<p className="text-base text-muted-foreground">
							{subtitle}
						</p>
					</div>
					<div className="space-y-2">
						<Button className="w-full">
							<GoogleIcon data-icon="inline-start" />
							Continue with Google
						</Button>
						<Button className="w-full">
							<AppleIcon data-icon="inline-start" />
							Continue with Apple
						</Button>
						<Button className="w-full">
							<GithubIcon data-icon="inline-start" />
							Continue with GitHub
						</Button>
					</div>

					<AuthDivider>OR</AuthDivider>

					<form action={action} method="post" className="space-y-3">
						{!isSignup && <input type="hidden" name="redirectTo" value="/admin" />}
						<p className="text-start text-muted-foreground text-xs">
							{isSignup ? "Create your Revile admin account." : "Enter your email address and password to continue."}
						</p>
						<InputGroup>
							<InputGroupInput
								name="email"
								placeholder="editor@revile.com"
								type="email"
								required
							/>
							<InputGroupAddon align="inline-start">
								<AtSignIcon />
							</InputGroupAddon>
						</InputGroup>

						<InputGroup>
							<InputGroupInput
								name="password"
								placeholder={isSignup ? "Create a secure password" : "Enter your password"}
								type="password"
								required
								minLength={8}
							/>
							<InputGroupAddon align="inline-start">
								<LockKeyholeIcon />
							</InputGroupAddon>
						</InputGroup>

						<Button className="w-full" type="submit">
							{submitLabel}
						</Button>
					</form>

					<p className="mt-2 text-sm text-muted-foreground">
						{isSignup ? "Already have an account?" : "Need an account?"}{" "}
						<a href={switchHref} className="font-medium text-slate-900 underline underline-offset-4 hover:text-primary">
							{switchLabel}
						</a>
					</p>

					<p className="mt-8 text-muted-foreground text-sm">
						By continuing, you agree to our{" "}
						<a className="underline underline-offset-4 hover:text-primary" href="#">
							Terms of Service
						</a>{" "}
						and{" "}
						<a className="underline underline-offset-4 hover:text-primary" href="#">
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

