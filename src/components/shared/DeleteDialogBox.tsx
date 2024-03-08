import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export function DeleteDialogBox({ deletePostHandler }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src="/assets/delete.svg"
          alt="delete"
          width={22}
          height={22}
          className="cursor-pointer object-contain"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-5/6">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete the post?</DialogTitle>
          <DialogDescription>
            Once the post is deleted, it cannot be retrieved back.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="m-3">
              Dont Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-red-600 text-white m-3 hover:bg-red-600"
              onClick={deletePostHandler}
            >
              Delete the post
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
