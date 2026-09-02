export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== "GET") {
			return new Response("Only GET allowed", { status: 405 });
		}

		const url = new URL(request.url);
		const prompt = url.searchParams.get("prompt");

		if (!prompt) {
			return new Response(
				JSON.stringify({ error: "prompt is required" }),
				{
					status: 400,
					headers: { "content-type": "application/json" },
				}
			);
		}

		try {
			const inputs = {
				prompt,
			} satisfies AiTextToImageInput;

			const response =
				await env.AI.run<"@cf/black-forest-labs/flux-2-dev">(
					"@cf/black-forest-labs/flux-2-dev",
					inputs,
				);

			return new Response(response, {
				headers: {
					"content-type": "image/png",
				},
			});
		} catch (error) {
			return new Response(
				JSON.stringify({
					error: "Image generation failed",
					detail: String(error),
				}),
				{
					status: 500,
					headers: { "content-type": "application/json" },
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;
