import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Menu } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ChatSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 flex items-center justify-between px-4 border-b border-cyber-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-foreground hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CyberChat AI
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium">
                Online
              </div>
            </div>
          </header>
          
          {/* Chat Interface */}
          <ChatInterface />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;