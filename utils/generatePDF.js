import * as Print from "expo-print";
import {shareAsync} from "expo-sharing";
import {formatCurrency} from "./formatCurrency";
import {formatDate} from "./formatDate";
import * as FileSystem from 'expo-file-system';

export const generatePDF = async (transactions, startDate, endDate, total_transaction, total_sales) => {


   let transactionsElem = ``;
   transactions.forEach((trans, index) => {
      let products = [];
      trans.items.forEach((item) => {
         products.push(`${item.qty} ${item.product.name}`)
      })

      transactionsElem += `<tr class="table-body">
        <td style="font-family: sans-serif; padding-left: 8px">${index}</td>
        <td class="left" style="font-family: sans-serif;">${trans.id}</td>
        <td class="left" style="font-family: sans-serif;">${!trans.is_takeaway ? 'Dine-in' : 'Takeaway'}</td>
        <td class="left" style="font-family: sans-serif;width: 15%">${!trans.is_takeaway ? trans?.table?.name : trans?.customer_name}</td>
        <td class="products" style="font-family: sans-serif; padding-left: 8px"> ${products.join(', ')}
        </td>
        <td class="sub-total left green" style="font-family: sans-serif;">${formatCurrency(parseInt(trans.total_price))}</td>
        <td class="left" style="font-family: sans-serif;">${formatDate(trans.created_at)}</td>
    </tr>`
   });


   const html = `<!DOCTYPE HTML>
<html lang="id">
<head>
    <meta content="text/html;charset=UTF-8" http-equiv="Content-Type">
    <title>Transaction Report</title>
    <style>
        @page {
            size: 11.69in 16.54in;
            margin: 27mm 16mm 27mm 16mm;
        }

        table {
            width: 100%;
            font-family: Poppins, sans-serif;
            color: #7d7d83;
        }

        .letterhead {
            color: #414141;
        }

        .corporate {
            color: #414141;
            font-weight: 700;
            font-size: 13px;
        }

        .corporate-address {
            color: #414141;
            font-weight: 300;
            font-size: 11px;
        }

        .title {
            color: #414141;
            font-weight: 700;
            font-size: 24px;
        }

        p {
            font-weight: 300;
            font-size: 13px;
        }

        hr {
            border: 1px solid #CECECE;
        }

        h3 {
            padding: 0;
            margin: 0;
        }

        .divider {
            /*margin-top: 50px;*/
        }

        .total {
            font-weight: 700;
            font-size: 20px;
            background: #EEF9FF;
            width: 25%;
            padding: 16px 32px;
        }

        .total-amount {
            font-weight: 300;
            font-size: 20px;
            background: #EEF9FF;
            width: 25%;
            padding: 16px 32px;
        }

        .price {
            width: 15%;
            padding: 0 32px 0 0;
        }

        .sub-total {
            width: 15%;
            padding: 0 32px 0 0;
        }

        .table-header {
            background: #EEF9FF;
            font-weight: 700;
            font-size: 20px;
        }

        .table-header td {
            padding: 10px;
        }

        td.left {
            padding: 16px 0;
        }

        .table-body {


        }

        td.right {
            text-align: right;
        }

        .products {
            width: 30%;
        }

        td.left {
            text-align: left;
            text-indent: 12px;
        }

        .green {
            color: #079992 !important;
        }

        .corporate-image img {
            height: 54px;
        }
    </style>
</head>

<body>
<table class="letterhead">
    <tr>
        <td class="corporate-image">
        </td>
    </tr>
    <tr>
        <td class="corporate" style="font-family: sans-serif; font-weight: bold;">KARASA NIRWANA</td>
    </tr>
    <tr>
        <td class="corporate-address">
            <h6 style="font-family: sans-serif; margin-top: 0; font-weight: normal">Jl. Arief Rahman Hakim No.35,
                Cigadung, Kec. Subang, Kabupaten Subang, Jawa Barat 41213</h6>
        </td>
    </tr>
</table>

<table class="title">
    <tr>
        <td>
            <h2 style="font-family: sans-serif; margin-top: 0; margin-bottom: 0;">TRANSACTIONS REPORT</h2>
        </td>
    </tr>

</table>

<table>
    <!-- Add your historical transaction details here -->
    <tr>
        <td style="padding-left: 10px; padding-top: 20px">
            <h6 style="margin-bottom: 4px; font-family: sans-serif; margin-top: 0; font-weight: normal">Print Date :
                ${formatDate(new Date())}</h6>

        </td>
    </tr>

    <tr>
        <td style="padding-left: 10px;">
            <h6 style="margin-bottom: 4px; font-family: sans-serif; margin-top: 0; font-weight: normal">Date Range :
                ${startDate} - ${endDate} </h6>

        </td>
    </tr>

    <tr style=" width: 50%; gap: 24px; display: flex">
        <td style="padding-left: 10px;">
            <h6 style="margin-bottom: 4px; font-family: sans-serif; margin-top: 0; font-weight: normal">Total
                Transaction : ${total_transaction} </h6>
        </td>
    </tr>


</table>
<hr class="divider">

<table>
    <tr class="table-header">
        <td style="font-family: sans-serif; color: #333;">NO</td>
        <td style="font-family: sans-serif; color: #333;">Receipt ID</td>
        <td style="font-family: sans-serif; color: #333;">Type</td>
        <td style="font-family: sans-serif; color: #333;">Table/Customer Name</td>
        <td style="font-family: sans-serif; color: #333;">Products</td>
        <td style="font-family: sans-serif; color: #333;">Total Price</td>
        <td style="font-family: sans-serif; color: #333;">Date Created</td>
    </tr>
    ${transactionsElem}
</table>
<hr>
<table>
    <tr>
        <td></td>
        <td></td>
        <td class="total" style="font-family: sans-serif; font-weight: bolder; color: #333;">Total Sales</td>
        <td class="right green total-amount" style="font-family: sans-serif; font-weight: bolder; color:#079992;">
            ${formatCurrency(total_sales)}
        </td>
    </tr>
</table>
</body>
</html>
`;

   const { uri } = await Print.printToFileAsync({ html });
    try {
        await shareAsync(uri);
    } catch (error) {
        console.error('Error sharing PDF:', error.message);
    }

}
