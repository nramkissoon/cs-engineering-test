import { SidebarNavigation } from "~/components/sidebar";
import { Separator } from "~/components/ui/separator";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarNavigation />
      <Separator orientation="vertical" className="h-screen" />
      <div className="flex w-full overflow-scroll">
        <main className="mx-36 w-[600px] pt-10">{children}</main>
      </div>
    </div>
  );
}
