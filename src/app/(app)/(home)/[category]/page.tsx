interface Props {
    params: Promise<{ category: string }>;
}

const CateogryPage = async ({ params }: Props) => {
    const { category } = await params;
    return (
        <div>Category page: {category}</div>
    )
}

export default CateogryPage;
