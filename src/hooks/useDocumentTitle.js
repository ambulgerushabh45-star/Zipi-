import { useEffect } from 'react';

const BRAND_TITLE = 'ZIPI Drones & Controls';

export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${BRAND_TITLE}` : BRAND_TITLE;
  }, [pageTitle]);
}

