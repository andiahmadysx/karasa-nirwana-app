import * as Print from "expo-print";
import {shareAsync} from "expo-sharing";

const html = `<!DOCTYPE HTML>
<html lang="id">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Document</title>
    <style>
        table {
            width: 100%;
            font-family: Poppins,sans-serif;
            color: #7d7d83;
        }
        /*table, th, td {*/
        /*    border: 1px solid;*/
        /*}*/
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
            margin-top: 50px;
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
            width: 25%;
            padding: 0 32px 0 0;
        }
        .sub-total {
            width: 25%;
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
        td.right {
            text-align: right;
        }
        td.left {
            text-align: left;
            text-indent: 10px;
        }
        .green {
            color: #079992!important;
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
            <img src="{{ $school->icon_url }}" style="margin-bottom: 10px;">
        </td>
    </tr>
    <tr>
        <td class="corporate" style="font-family: sans-serif; font-weight: bold;">KARASA NIRWANA</td>
    </tr>
    <tr>
        <td class="corporate-address">
            <h6 style="font-family: sans-serif; margin-top: 0; font-weight: normal">Jl. Arief Rahman Hakim No.35, Cigadung, Kec. Subang, Kabupaten Subang, Jawa Barat 41213</h6>
        </td>
    </tr>
</table>
<table class="title">
    <tr>
        <td>
            <h1 style="font-family: sans-serif; margin-top: 0; margin-bottom: 0;">INVOICE</h1>
        </td>
    </tr>
</table>
<table class="header">
    <tr>
        <td>
            <h6 style="font-family: sans-serif; margin-bottom: 0; font-weight: normal">Transaction Status :</h6>
        </td>
    </tr>
    <tr>
        <td>
            <h3 style="font-family: sans-serif; color: #4CAF50; font-size: 24px;">Paid</h3>
        </td>
    </tr>
    <tr>
        <td>
            <h6 style="font-family: sans-serif; margin-bottom: 0; font-weight: normal">Cashier :</h6>
        </td>
        <td>
            <h6 style="font-family: sans-serif; margin-bottom: 0; font-weight: normal">Payment Method:</h6>
        </td>
    </tr>
    <tr>
        <td>
            <h3 style="font-family: sans-serif; color: #333;">Andi Ahmad</h3>
        </td>
        <td>
            <h3 style="font-family: sans-serif; color: #333;">CASH</h3>
        </td>
    </tr>
    <tr>
        <td>
            <h6 style="font-family: sans-serif; margin-bottom: 0; font-weight: normal">Date :</h6>
        </td>
        <td>
            <h6 style="font-family: sans-serif; margin-bottom: 0; font-weight: normal">Invoice ID:</h6>
        </td>
    </tr>
    <tr>
        <td>

            <h3 style="font-family: sans-serif; color: #333;">30, 30, 2024</h3>
        </td>
        <td>
            <h3 style="font-family: sans-serif; color: #333;">INV-FDSAKJ2332</h3>
        </td>
    </tr>
</table>
<hr class="divider">
<table>
    <tr class="table-header">
        <td style="font-family: sans-serif; color: #333;">Product Name</td>
        <td style="font-family: sans-serif; color: #333;">QTY</td>
        <td style="font-family: sans-serif; color: #333;">Price</td>
        <td style="font-family: sans-serif; color: #333;">Subtotal</td>
    </tr>
    <tr>
        <td style="font-family: sans-serif;">Pisang Goreng</td>
        <td style="font-family: sans-serif;" class="left">1</td>
        <td style="font-family: sans-serif;" class="price left">Rp.39.300</td>
        <td style="font-family: sans-serif;" class="sub-total left green">Rp.39.300</td>
    </tr>

</table>
<hr>
<table>
    <tr>
        <td></td>
        <td></td>
        <td style="font-family: sans-serif; font-weight: bolder; color: #333;" class="total">Total</td>
        <td style="font-family: sans-serif; font-weight: bolder; color:#079992;" class="right green total-amount">Rp.39.300</td>
    </tr>
</table>
</body>
</html>
`


export const generatePDF = async () => {
   const { uri } = await Print.printToFileAsync({ html });
   console.log('File has been saved to:', uri);
   await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
}
