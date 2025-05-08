import React, { use, useState } from "react";
import { Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

function InfoButton({ href, title }: { href: string, title?: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-blue-400 hover:text-blue-500"
      asChild
      title={title || "Ver información"}
      onClick={() => setLoading(!loading)}
    >
      <Link href={href}>
        
        {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Info className="h-4 w-4" />
            )} 
      </Link>
    </Button>
  );
}

export default InfoButton;
