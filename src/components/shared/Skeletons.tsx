import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton({
  count = 1,
  myRef,
}: {
  count: number;
  myRef?: any;
}) {
  const arr: any[] = new Array(count).fill(0);
  return (
    <>
      {arr.map((elem, index) => (
        <div
          className="flex flex-col space-y-3 my-5 bg-dark-2 p-7"
          key={index}
          ref={myRef}
        >
          <Skeleton className="h-[100px] w-full rounded-xl bg-[#3B3B3B]" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-[#3B3B3B]" />
            <Skeleton className="h-4 w-[100px] bg-[#3B3B3B]" />
          </div>
        </div>
      ))}
    </>
  );
}

export function SearchUserSkeleton({ count = 1 }) {
  const arr: any[] = new Array(count).fill(0);
  return (
    <>
      {arr.map((elem, index) => (
        <div
          className="flex space-x-3 max-xs:rounded-xl max-xs:p-4 max-xs:flex-col max-xs:items-center"
          key={index}
        >
          <Skeleton className="h-12 w-12 rounded-full max-xs:hidden bg-[#3B3B3B]" />

          <Skeleton className="h-[45px] w-5/6 rounded-xl max-xs:h-[50px] max-xs:w-full max-xs:mb-3 bg-[#3B3B3B]" />
          <Skeleton className="h-[45px] w-1/6 rounded-xl max-xs:h-[30px] max-xs:w-full bg-[#3B3B3B]" />
        </div>
      ))}
    </>
  );
}

export function ActivitySkeleton({ count = 1 }) {
  const arr: any[] = new Array(count).fill(0);
  return (
    <>
      {arr.map((elem, index) => (
        <div className="flex space-x-3 mx-5 py-3" key={index}>
          <Skeleton className="h-12 w-12 rounded-full bg-[#3B3B3B]" />

          <Skeleton className="h-[50px] w-full rounded-xl bg-[#3B3B3B]" />
        </div>
      ))}
    </>
  );
}

export function CreatePostSkeleton() {
  return (
    <div className="flex flex-col space-y-3 mt-10">
      <Skeleton className="h-[300px] w-full rounded-xl bg-[#3B3B3B]" />

      <Skeleton className="h-10 w-full space-y-3 bg-[#3B3B3B]" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col space-y-3 my-3">
      <div className="flex space-x-3">
        <Skeleton className="h-20 w-20 rounded-full bg-[#3B3B3B]" />

        <Skeleton className="h-[90px] w-full rounded-xl bg-[#3B3B3B]" />
      </div>
      <Skeleton className="h-4 w-full bg-[#3B3B3B]" />
    </div>
  );
}

export function SuggestedUsersSkeleton({ count = 1 }) {
  const arr: any[] = new Array(count).fill(0);
  return (
    <>
      {arr.map((elem, index) => (
        <div
          className="flex space-x-3 max-xs:rounded-xl max-xs:p-4 max-xs:flex-col max-xs:items-center mb-3"
          key={index}
        >
          <Skeleton className="h-8 w-10 rounded-full bg-[#3B3B3B]" />

          <Skeleton className="h-8 w-full rounded-xl  bg-[#3B3B3B]" />
        </div>
      ))}
    </>
  );
}
