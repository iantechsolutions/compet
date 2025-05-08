export default function LayoutContainer(props: { children: React.ReactNode }) {
    return <div className="w-full p-[5vh] space-y-5">{props.children}</div>;
  }
  