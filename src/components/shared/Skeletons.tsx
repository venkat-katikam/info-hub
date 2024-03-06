import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton({ count = 1 }) {
  const arr: any[] = new Array(count).fill(0);
  return (
    <>
      {arr.map((elem, index) => (
        <div className="flex flex-col space-y-3 my-5 bg-dark-2 p-7" key={index}>
          <Skeleton className="h-[100px] w-full rounded-xl bg-dark-1" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-dark-1" />
            <Skeleton className="h-4 w-[100px] bg-dark-1" />
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
          <Skeleton className="h-12 w-12 rounded-full max-xs:hidden bg-dark-2" />

          <Skeleton className="h-[45px] w-5/6 rounded-xl max-xs:h-[50px] max-xs:w-full max-xs:mb-3 bg-dark-2" />
          <Skeleton className="h-[45px] w-1/6 rounded-xl max-xs:h-[30px] max-xs:w-full bg-dark-2" />
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
        <div className="flex space-x-3  bg-dark-2 px-7 py-4" key={index}>
          <Skeleton className="h-12 w-12 rounded-full bg-dark-1" />

          <Skeleton className="h-[50px] w-full rounded-xl bg-dark-1" />
        </div>
      ))}
    </>
  );
}

export function CreatePostSkeleton() {
  return (
    <div className="flex flex-col space-y-3 mt-10">
      <Skeleton className="h-[300px] w-full rounded-xl bg-dark-2" />

      <Skeleton className="h-10 w-full space-y-3 bg-dark-2" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col space-y-3 my-3">
      <div className="flex space-x-3">
        <Skeleton className="h-20 w-20 rounded-full bg-dark-2" />

        <Skeleton className="h-[90px] w-full rounded-xl bg-dark-2" />
      </div>
      <Skeleton className="h-4 w-full bg-dark-2" />
    </div>
  );
}
