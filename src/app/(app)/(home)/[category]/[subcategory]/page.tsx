interface Props {
    params: Promise<{ category: string, subcategory: string }>;
}

const CateogryPage = async ({ params }: Props) => {
    const { category, subcategory } = await params;
    return (
        <div>SubCategory page: {category} & {subcategory}</div>
    )
}

export default CateogryPage;
