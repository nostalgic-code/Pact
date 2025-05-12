import { cn } from '@/lib/utils'

export const Logo = ({
    className
}) => {
    return (
        <svg
            viewBox="0 0 120 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('h-8 w-auto', className)}>
            <g transform="translate(4,0)">
                {/* Main stem */}
                <path
                    d="M16 32V20"
                    stroke="url(#logo-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                {/* Left branch */}
                <path
                    d="M16 20C16 20 12 16 8 16C8 16 12 12 16 12"
                    stroke="url(#logo-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Right branch */}
                <path
                    d="M16 20C16 20 20 16 24 16C24 16 20 12 16 12"
                    stroke="url(#logo-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Top growth */}
                <path
                    d="M16 12C16 12 12 8 16 4C20 8 16 12 16 12Z"
                    fill="url(#logo-gradient)"
                />
            </g>
            {/* "Pact" text */}
            <path
                d="M48 18.054C48 18.5903 48.1393 19.0453 48.298 19.404C48.468 19.7513 48.7513 19.925 49.148 19.925H50.338V21.84H48.808C47.9353 21.84 47.2667 21.636 46.802 21.228C46.3373 20.82 46.105 20.157 46.105 19.239V14.054H45V12.473H46.105V10.144H48.06V12.473H50.338V14.054H48.06V18.054Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="16"
                    y1="4"
                    x2="16"
                    y2="32"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop offset="1" stopColor="#2BC8B7" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export const LogoIcon = ({
    className
}) => {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-8', className)}>
            {/* Main stem */}
            <path
                d="M16 32V20"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            {/* Left branch */}
            <path
                d="M16 20C16 20 12 16 8 16C8 16 12 12 16 12"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            {/* Right branch */}
            <path
                d="M16 20C16 20 20 16 24 16C24 16 20 12 16 12"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            {/* Top growth */}
            <path
                d="M16 12C16 12 12 8 16 4C20 8 16 12 16 12Z"
                fill="url(#logo-gradient)"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="16"
                    y1="4"
                    x2="16"
                    y2="32"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop offset="1" stopColor="#2BC8B7" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export const LogoStroke = ({
    className
}) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor" />
        </svg>
    );
}
