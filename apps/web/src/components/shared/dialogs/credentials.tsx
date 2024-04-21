"use client";
import { Button } from "@/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Check, Copy, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const RTMP_SERVER = "rtmp://localhost:3000/live" as const;

const CredentialsDialog = () => {
  const [server, setServer] = useState({ copy: false });
  const [streamKey, setStreamKey] = useState({ show: false, copy: false });
  const { data: session } = useSession();

  const onChange = (key: "server" | "streamkey", value: "show" | "copy") => {
    if (key === "server") {
      setServer((prev) => ({ ...prev, [value]: true }));
      navigator.clipboard.writeText(RTMP_SERVER);
      setTimeout(() => {
        setServer((prev) => ({ ...prev, [value]: false }));
      }, 1000);
    }

    if (key === "streamkey") {
      if (value === "show") {
        setStreamKey((prev) => ({ ...prev, show: !prev.show }));
        return;
      }
      setStreamKey((prev) => ({ ...prev, [value]: true }));
      navigator.clipboard.writeText(
        `${session?.user.name}?key=${session?.user.streamKey}`,
      );
      setTimeout(() => {
        setStreamKey((prev) => ({ ...prev, [value]: false }));
      }, 1000);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="uppercase">credentials</DialogTitle>
        <DialogDescription>
          <p className="mt-3">
            Here is useful links to configure your streaming softwares:
            <Button variant={"link"} asChild className="ml-1 px-0">
              <a
                href="https://streamlabs.com/content-hub/post/how-to-stream-new-platform-custom-ingest"
                target="_blank"
              >
                Streamlabs
              </a>
            </Button>
            ,
            <Button variant={"link"} asChild className="px-0">
              <a
                href="https://service.streamboxy.com/support/solutions/articles/50000091089-rtmp-livestream-with-obs-studio"
                target="_blank"
              >
                OBS
              </a>
            </Button>
            ,
            <Button variant={"link"} asChild className="px-0">
              <a
                href="https://support.restream.io/en/articles/369436-stream-to-a-custom-rtmp-channel"
                target="_blank"
              >
                Restream
              </a>
            </Button>
          </p>
          <div className="mb-3 mt-3 space-y-3">
            <div>
              <Label className="uppercase">server</Label>
              <div className="relative flex items-center">
                <Input value={RTMP_SERVER} readOnly className="pr-10" />
                {!server.copy ? (
                  <Copy
                    className="absolute right-4 cursor-pointer"
                    size={15}
                    onClick={() => onChange("server", "copy")}
                  />
                ) : (
                  <Check
                    className="absolute right-4 text-green-500"
                    size={15}
                  />
                )}
              </div>
            </div>
            <div>
              <Label className="uppercase">stream key</Label>
              <div className="relative flex items-center">
                <Input
                  readOnly
                  className="pr-16"
                  value={
                    !streamKey.show
                      ? "********"
                      : `${session?.user.name}?key=${session?.user.streamKey}`
                  }
                />
                <Eye
                  className="absolute right-4 cursor-pointer"
                  size={15}
                  onClick={() => onChange("streamkey", "show")}
                />
                {!streamKey.copy ? (
                  <Copy
                    className="absolute right-10 cursor-pointer"
                    size={15}
                    onClick={() => onChange("streamkey", "copy")}
                  />
                ) : (
                  <Check
                    className="absolute right-10 text-green-500"
                    size={15}
                  />
                )}
              </div>
            </div>
          </div>
        </DialogDescription>
        <DialogClose asChild>
          <Button variant={"white"}>Got it</Button>
        </DialogClose>
      </DialogHeader>
    </DialogContent>
  );
};

export default CredentialsDialog;