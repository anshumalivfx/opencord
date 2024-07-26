"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckIcon, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";

const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const origin = useOrigin();
  const { server } = data;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const isModalOpen = isOpen && type === "invite";

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(true);

    setTimeout(() => {
      setCopiedCode(false);
    }, 3000);
  };

  const onNewGenerate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      if (res.status === 200) {
        onOpen("invite", { server: res.data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              Server Invite Link
            </Label>
            <div className="flex items-center mt-2 gap-x-2">
              <Input
                disabled={isLoading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                value={inviteUrl}
              />
              <Button disabled={isLoading} onClick={onCopy} size="icon">
                {copiedCode ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={onNewGenerate}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-xs text-zinc-500 mt-4"
            >
              Generate a new link
              <RefreshCw
                className={`w-4 h-4 ml-2 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
