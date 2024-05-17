

export type HeaderProps = {
    children: React.ReactNode;
    title?: React.ReactNode;
  };
  

export default function Header(props: HeaderProps) {
return (
    <div>
        <header className="fixed left-0 right-0 top-0 z-10 flex h-[70px] items-center border-b px-2 backdrop-blur-md md:px-4">
            <div className="w-full">{props.title}</div>
        </header>
        <div className="pt-16">
            {props.children}
        </div>
    </div>
    )
}