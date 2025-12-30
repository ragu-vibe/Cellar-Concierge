import { MessageThread } from "@/lib/types";

export const messageThreads: MessageThread[] = [
  {
    id: "thread-1",
    memberId: "member-1",
    amId: "am-1",
    subject: "September planning check-in",
    messages: [
      {
        id: "m1",
        sender: "am",
        timestamp: "2024-09-01T09:00:00Z",
        content: "Hi Alex — I drafted a September plan leaning into prestige + entertaining. Want to review together this week?"
      },
      {
        id: "m2",
        sender: "member",
        timestamp: "2024-09-01T11:30:00Z",
        content: "Looks great! Can we add one discovery bottle under £60?"
      },
      {
        id: "m3",
        sender: "am",
        timestamp: "2024-09-01T13:00:00Z",
        content: "Absolutely. I’ll swap in a Mosel Riesling with a strong critic signal."
      }
    ]
  }
];
