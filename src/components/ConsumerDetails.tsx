import React from 'react';
import type { ConsumerFormType } from '../types';

const ConsumerDetails: React.FC<{ data: ConsumerFormType }> = ({ data }) => (
  <div className="space-y-4 text-white">
    <p><strong>Household ID:</strong> {data.householdId}</p>
    <p><strong>Status:</strong> {data.status}</p>
    <p><strong>Household Head Name:</strong> {data.householdHeadName}</p>
    <p><strong>Dzongkhag:</strong> {data.addressDzongkhag}</p>
    <p><strong>Gewog:</strong> {data.addressGewog}</p>
  </div>
);

export default ConsumerDetails;
