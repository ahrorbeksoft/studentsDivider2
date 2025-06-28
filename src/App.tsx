import "./App.css";
import { useStore } from "@tanstack/react-store";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NewGroupDialog from "./components/dialogs/group";
import MainPage from "./components/main";
import { AlertDialogProvider } from "./components/ui/alert-dialog-provider";
import { Toaster } from "./components/ui/sonner";
import { db } from "./lib/db";
import { activeGroupStore, groupsStore, isLoadedStore } from "./lib/stores";

function App() {
  const isLoaded = useStore(isLoadedStore);
  const groups = useLiveQuery(() => db.groups.toArray(), []);

  useEffect(() => {
    if (groups) {
      groupsStore.setState(() => groups);
    }

    if (!isLoaded && groups) {
      if (groups.length > 0) {
        groupsStore.setState(() => groups);
        activeGroupStore.setState(() => groups[0]);
      }

      isLoadedStore.setState(() => true);
    }
  }, [isLoaded, groups]);

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <AlertDialogProvider>
        {!isLoaded || !groups ? (
          <div>Loading...</div>
        ) : (
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <SidebarInset>
              <NewGroupDialog />
              <MainPage />
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        )}
      </AlertDialogProvider>
    </ThemeProvider>
  );
}

export default App;
