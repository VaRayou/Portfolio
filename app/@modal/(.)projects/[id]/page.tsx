import ProjectDetails from "@/app/projects/[id]/page";

export default async function ModalProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto">
      <ProjectDetails params={params} />
    </div>
  );
}
