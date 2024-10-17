import { Fragment } from 'react';
import { Skeleton } from '@nextui-org/react';

interface Props {
    skeletonItems?: number
}

export const SkeletonSectionCard = ({ skeletonItems = 12 }: Props) => {

    const items = Array.from({ length: skeletonItems }, (__, index) => index + 1);

    return (
        <Fragment>
            {
                items.map((__, index) => (
                    <div className="w-full h-[8rem] lg:h-[7rem]  py-5 px-2 rounded-lg overflow-hidden relative shadow-xl border-1 border-gray-200 flex items-center" key={index}>
                        <Skeleton className="w-[4rem] h-[4rem] rounded-full px-5" />
                        <div className="w-full px-4">
                            <Skeleton className="w-full h-6 rounded-2xl my-2" />
                            <Skeleton className="w-full h-3 rounded-2xl my-2" />
                        </div>
                    </div>
                ))
            }
        </Fragment>
    )
}

