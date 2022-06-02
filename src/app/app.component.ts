import { Component, ElementRef, ViewChild } from "@angular/core";

import { jsPDF } from "jspdf";

import { DATA } from "./data";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
const PDF_EXTENSION = ".pdf";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent {


  data = DATA;


  @ViewChild('table') table!: ElementRef<HTMLTableElement>;

  downloadXLSXFile(): void {
    const data = DATA;

    const replacer = (key: any, value: any) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const xlsx = data.map((row: any) =>
      header
        .map((fieldName: any) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    xlsx.unshift(header.join(","));
    const xlsxArray = xlsx.join("\r\n");

    const blob = new Blob([xlsxArray], { type: EXCEL_TYPE });

    this.saveAsFile(blob, EXCEL_EXTENSION);
  }

  downloadPDFFile(): void {

    const doc = new jsPDF();

    doc.html(
      this.table.nativeElement,
      {
        windowWidth: document.body.clientWidth,
        x: 0,
        y: 4,
        width: 500,
        margin: 5,
        callback: (doc: jsPDF) => {
          doc.save("USERS__" + new Date().getTime() + PDF_EXTENSION);
        }
      }
    )
  }

  saveAsFile(data: Blob, extention: string): void {
    const objectUrl: string = URL.createObjectURL(data);
    const link: any = document.createElement("a");

    link.download = "USERS__" + new Date().getTime() + extention;
    link.href = objectUrl;
    link.click();
  }
}
