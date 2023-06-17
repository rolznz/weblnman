import { ListPaymentsResponse } from "@webbtc/webln-types";
import { useWebLNRequest } from "../hooks/useWebLNRequest";
import { Loading } from "./Loading";

export function PaymentsScreen() {
  const { data: paymentsResponse } =
    useWebLNRequest<ListPaymentsResponse>("listpayments");

  if (!paymentsResponse) {
    return <Loading />;
  }

  return (
    <>
      <p>Payments ({paymentsResponse.payments.length})</p>
      <table className="table">
        <thead>
          <tr>
            <th>Hash</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {paymentsResponse.payments.map((payment) => (
            <tr key={payment.payment_hash}>
              <th>{payment.payment_hash}</th>
              <th>{payment.value_sat}</th>
              <th>{payment.fee_sat}</th>
              <th>{payment.status}</th>
              <th>
                {new Date(
                  parseInt(payment.creation_date) * 1000
                ).toDateString()}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
