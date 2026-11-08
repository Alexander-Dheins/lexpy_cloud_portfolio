import { cacheLife } from "next/cache";
import { GITHUB_USER } from "./github-config";

/* Total de estrellas de los repositorios propios (sin forks).
   Se cachea y se refresca cada hora; si GitHub no responde devuelve null
   y la barra muestra el ícono sin número en vez de inventar uno. */
export async function getGithubStars(): Promise<number | null> {
  "use cache";
  cacheLife("hours");

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "lexpy.cloud",
        },
      },
    );
    if (!response.ok) return null;
    const repos = (await response.json()) as {
      fork: boolean;
      stargazers_count: number;
    }[];
    if (!Array.isArray(repos)) return null;
    return repos
      .filter((repo) => !repo.fork)
      .reduce((total, repo) => total + repo.stargazers_count, 0);
  } catch {
    return null;
  }
}
