const endpoint = "https://api.github.com/graphql";

const profileQuery = `
query($login: String!) {
  user(login: $login) {
    followers { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name } }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount date } }
      }
    }
  }
}`;

function sumLanguageSize(repositoryList) {
  const sizeByLanguage = new Map();
  for (const repository of repositoryList) {
    for (const { size, node } of repository.languages.edges) {
      sizeByLanguage.set(node.name, (sizeByLanguage.get(node.name) ?? 0) + size);
    }
  }
  return [...sizeByLanguage]
    .map(([name, size]) => ({ name, size }))
    .sort((left, right) => right.size - left.size);
}

export async function fetchProfile({ login, token }) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "profile-asset-generator",
    },
    body: JSON.stringify({ query: profileQuery, variables: { login } }),
  });
  if (!response.ok) {
    throw new Error(`GitHub API responded ${response.status}: ${await response.text()}`);
  }
  const payload = await response.json();
  if (payload.errors || !payload.data?.user) {
    throw new Error(`GitHub API query failed: ${JSON.stringify(payload.errors ?? payload)}`);
  }

  const { user } = payload.data;
  const repositoryList = user.repositories.nodes;
  const collection = user.contributionsCollection;
  return {
    login,
    followerCount: user.followers.totalCount,
    repositoryCount: user.repositories.totalCount,
    starCount: repositoryList.reduce((total, repository) => total + repository.stargazerCount, 0),
    commitCount: collection.totalCommitContributions,
    pullRequestCount: collection.totalPullRequestContributions,
    issueCount: collection.totalIssueContributions,
    contributionTotal: collection.contributionCalendar.totalContributions,
    weekList: collection.contributionCalendar.weeks.map((week) => week.contributionDays),
    languageList: sumLanguageSize(repositoryList),
  };
}
