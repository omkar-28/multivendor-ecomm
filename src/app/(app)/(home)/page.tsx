import configPromise from '@payload-config';
import { getPayload } from "payload";

/**
 * Asynchronously fetches category data from the Payload CMS and renders it as formatted JSON within a React component.
 *
 * Retrieves all entries from the 'categories' collection and displays the result inside a `<div>`.
 *
 * @returns A React element containing the formatted JSON representation of the categories data.
 */
export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'categories',
  });

  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}