export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== "GET") {
			return new Response("Only GET allowed", { status: 405 });
		}

		try {
			const body = await request.json() as { prompt?: string };

			if (!body.prompt) {
				return new Response(
					JSON.stringify({ error: "prompt is required" }),
					{
						status: 400,
						headers: { "content-type": "application/json" },
					}
				);
			}

			const inputs = {
				prompt: body.prompt,
			} satisfies AiTextToImageInput;

			const response =
				await env.AI.run<"@cf/leonardo/lucid-origin">(
					"@cf/leonardo/lucid-origin",
					inputs,
				);

			return new Response(response, {
				headers: {
					"content-type": "image/png",
				},
			});
		} catch {
			return new Response(
				JSON.stringify({ error: "Invalid JSON body" }),
				{
					status: 400,
					headers: { "content-type": "application/json" },
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;
