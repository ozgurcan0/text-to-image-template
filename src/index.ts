export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== "GET") {
			return new Response("Only GET allowed", { status: 405 });
		}

		const url = new URL(request.url);
		const prompt = url.searchParams.get("prompt");

		if (!prompt) {
			return Response.json(
				{ error: "prompt is required" },
				{ status: 400 }
			);
		}

		try {
			const response = await env.AI.run(
				"@cf/black-forest-labs/flux-2-dev",
				{
					multipart: {
						prompt
					}
				}
			);

			const base64 = response.image;
			const binary = Uint8Array.from(
				atob(base64),
				c => c.charCodeAt(0)
			);

			return new Response(binary, {
				headers: {
					"content-type": "image/jpeg"
				}
			});

		} catch (error) {
			return Response.json(
				{
					error: "Image generation failed",
					detail: String(error)
				},
				{ status: 500 }
			);
		}
	},
} satisfies ExportedHandler<Env>;
