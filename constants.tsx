
import { User, Parcel, Transaction, Dispute } from './types';

export const MOCK_USER: User = {
  id: "USR-1",
  name: "Jean-Claude",
  email: "jean@example.rw",
  nationalId: "1 1990 8 0000000 0 00",
  isVerified: true,
  avatar: "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Jean+Claude",
  role: "CITIZEN"
};

export const MOCK_PARCELS: Parcel[] = [
  {
    upi: "5/03/12/04/111",
    size: "2,500 sqm",
    use: "Residential",
    district: "Gasabo",
    location: "Kacyiru",
    status: "registered",
    ownerName: "Jean-Claude",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuADlq6GMeZ_0zdsxDpoWyx6GpSKPJjJ6sLooe4UvUGe4ngrahftjUlJK2qVhzBjOsx3nrUt1C3yaPsBHm6MAiLsTG214EK5A-6unOa4wLag5mvQ3l6-Zqo9cflrg6TzjNrUuvHcTxaC8INLJ5eolyz9lSeUMZMnMtU6cLbv9BiKfBPrNkStEb9PbwEr8bRvFtI8RAC-_Wp6SeWwB2BHn_CLQifOMejxZmHoaMbskzTEu-nINJbkuO9M7OqSJ0dtHRE9jzTX6SBUCRBO",
    price: "45,000,000"
  },
  {
    upi: "2/04/08/01/205",
    size: "5,800 sqm",
    use: "Agricultural",
    district: "Bugesera",
    location: "Nyamata",
    status: "registered",
    ownerName: "Jean-Claude",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8pzKDoHAacANESIVkpicHvhXl7_rVX_a1ts_TNVEk4oj6V9GkOhVs8nw2EEvcpWsCoa8_MJq7hMpuI_IwbYm_F4RljhGq5-V88ehyb-zKDjt5LlSEj9pGBLwk_2V1ryFePu9Zk_NVrd-nkNMEO12QRGVUHhIC9wHQRq0XhskopPqLxVVu8weEnfxmDlEkPhGnObLgniXv20AoPaPZClGQdpDkABiUSI5Y6PEP9HHQcoeadZdpkRSo3K2ZikvYGVuBe56BA9b3f2ka",
    price: "4,500,000"
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TRX-89204",
    title: "Voluntary Sale",
    upi: "2/03/04",
    status: "action_required",
    date: "Oct 24, 2023",
    step: "Awaiting Buyer Signature",
    progress: 60
  },
  {
    id: "TRX-44201",
    title: "Mortgage Registration",
    upi: "5/11/09",
    status: "in_progress",
    date: "Oct 20, 2023",
    step: "Bank Verification",
    progress: 20
  }
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "DSP-102",
    upi: "1/02/03/04/555",
    type: "Boundary",
    status: "Mediation",
    dateOpened: "Nov 12, 2023",
    parties: ["Jean-Claude M.", "Neighbor X"],
    description: "Discrepancy in the north-western fence line after latest survey.",
    location: "Kacyiru, Gasabo"
  },
  {
    id: "DSP-098",
    upi: "4/12/01/01/992",
    type: "Ownership",
    status: "Resolved",
    dateOpened: "Sep 05, 2023",
    parties: ["Family Council", "Buyer Z"],
    description: "Inheritance claim conflicting with recent sale agreement.",
    location: "Nyamata, Bugesera"
  }
];
export const API_BASE_URL = "https://ubutaka-admin.vercel.app/api";
