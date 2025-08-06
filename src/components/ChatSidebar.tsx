import { useState } from "react";
import { MessageSquare, Plus, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

export function ChatSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Getting started with AI', timestamp: new Date() },
    { id: '2', title: 'Code optimization tips', timestamp: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Design patterns discussion', timestamp: new Date(Date.now() - 172800000) },
  ]);
  const [activeChat, setActiveChat] = useState('1');

  const createNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: 'New chat',
      timestamp: new Date(),
    };
    setChatHistory([newChat, ...chatHistory]);
    setActiveChat(newChat.id);
  };

  const deleteChat = (id: string) => {
    setChatHistory(chatHistory.filter(chat => chat.id !== id));
    if (activeChat === id && chatHistory.length > 1) {
      setActiveChat(chatHistory.find(chat => chat.id !== id)?.id || '');
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} border-r border-cyber-border bg-sidebar`}>
      <SidebarContent className="bg-sidebar">
        {!collapsed && (
          <div className="p-4 border-b border-cyber-border">
            <Button 
              onClick={createNewChat}
              className="w-full justify-start gap-2 bg-primary hover:bg-primary/80 text-primary-foreground shadow-glow-cyan transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        )}

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground font-medium px-4 py-2">
              Chat History
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <div className="flex items-center group">
                    <SidebarMenuButton
                      asChild
                      className={`flex-1 ${
                        activeChat === chat.id 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" 
                          : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <button onClick={() => setActiveChat(chat.id)}>
                        <MessageSquare className="h-4 w-4 text-primary" />
                        {!collapsed && (
                          <div className="flex flex-col items-start min-w-0 flex-1">
                            <span className="text-sm truncate w-full text-left">
                              {chat.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(chat.timestamp)}
                            </span>
                          </div>
                        )}
                      </button>
                    </SidebarMenuButton>
                    
                    {!collapsed && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-cyber-border">
                          <DropdownMenuItem className="hover:bg-muted">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => deleteChat(chat.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}