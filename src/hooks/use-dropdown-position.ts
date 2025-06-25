import { RefObject, useEffect, useState } from "react";

export const useDropdownPosition = (dropdownRef: RefObject<HTMLDivElement | null>) => {
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        const updatePosition = () => {
            if (!dropdownRef.current) return { top: 0, left: 0 };

            const rect = dropdownRef.current.getBoundingClientRect();
            const dropDownWidth = 240;

            let left = rect.left + window.scrollX;
            const top = rect.bottom + window.scrollX;
            // Check if the dropdown goes off-screen to the right
            if (left + dropDownWidth > window.innerWidth) {
                left = rect.right + window.screenX - dropDownWidth;

                // If it goes off-screen to the right, adjust to the left side
                if (left < 0) {
                    left = window.innerWidth - dropDownWidth - 16; // Ensure it doesn't go off-screen to the left
                }
            }

            // Check if the dropdown goes off-screen to the left
            if (left < 0) {
                left = 16; // Ensure it doesn't go off-screen to the left
            }

            setPosition({ top, left });
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [dropdownRef]);

    return position;
}