import { ListInvoicesResponse } from "@webbtc/webln-types";
import { useWebLNRequest } from "../hooks/useWebLNRequest";
import { Loading } from "./Loading";

export function InvoicesScreen() {
  const { data: invoicesResponse } =
    useWebLNRequest<ListInvoicesResponse>("listinvoices");

  if (!invoicesResponse) {
    return <Loading />;
  }

  return (
    <>
      <p>Invoices ({invoicesResponse.invoices.length})</p>
      <table className="table">
        <thead>
          <tr>
            <th>Hash</th>
            <th>Amount</th>
            <th>Settled</th>
          </tr>
        </thead>
        <tbody>
          {invoicesResponse.invoices.map((invoice) => (
            <tr key={invoice.r_hash}>
              <th>{invoice.r_hash}</th>
              <th>{invoice.amt_paid_sat}</th>
              <th>
                {invoice.settle_date !== "0"
                  ? new Date(
                      parseInt(invoice.settle_date) * 1000
                    ).toDateString()
                  : "-"}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
