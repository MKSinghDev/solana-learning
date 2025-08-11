import Header from '~/components/organisms/layout/header';

interface Props {
    children: React.ReactNode;
    auth: React.ReactNode;
}

const PagesLayout = ({ children, auth }: Props) => (
    <div className="relative flex flex-col flex-1">
        <div className="flex flex-col flex-1 gap-4 w-full px-4 sm:px-10 max-w-[1344px] mx-auto">
            <Header />
            {children}
            {auth}
        </div>
    </div>
);

export default PagesLayout;
