"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ChatSidebar = ({ conversations, activeChatId, onSelectChat }) => {
  return (
    <aside className="h-full overflow-y-auto px-4 pt-4 pb-4 bg-gray-50">
      <h2 className="mb-3 text-sm font-semibold text-gray-800 tracking-wide">
        Conversations
      </h2>

      {(!conversations || conversations.length === 0) && (
        <p className="text-xs text-gray-500">
          No conversations yet. Start a new chat from the search above.
        </p>
      )}

      {conversations?.map((conversation) => {
        const isActive = conversation.id === activeChatId;

        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelectChat(conversation.id)}
            className={[
              "group flex w-full items-center gap-3 rounded-md px-3 py-2 mb-2 text-left transition-colors",
              isActive
                ? "bg-teal-50 border border-teal-200"
                : "hover:bg-gray-100 border border-transparent",
            ].join(" ")}
          >
            <Avatar
              size="sm"
              src={
                conversation.avatar ||
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              }
              alt={conversation.name}
              className="shrink-0"
            />

            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-gray-900">
                  {conversation.name}
                </p>
                {conversation.unreadCount ? (
                  <Badge className="shrink-0">
                    {conversation.unreadCount}
                  </Badge>
                ) : null}
              </div>
              <p className="truncate text-xs text-gray-500">
                {conversation.lastMessage || "No messages yet"}
              </p>
            </div>
          </button>
        );
      })}
    </aside>
  );
};

export default ChatSidebar;

