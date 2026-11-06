import { RepoIntelPage } from "@/components/repo-intel-page"
import { APP_NAME } from "@/lib/brand"

interface Props {
  params: Promise<{ owner: string; repo: string }>
}

export async function generateMetadata({ params }: Props) {
  const { owner, repo } = await params
  return { title: `${owner}/${repo} Intel · ${APP_NAME}` }
}

export default async function RepoIntelDetailPage({ params }: Props) {
  const { owner, repo } = await params
  return <RepoIntelPage owner={owner} repo={repo} />
}
