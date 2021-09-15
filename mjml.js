import mjml2html from 'mjml';

let mjmlString = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-button font-family="Helvetica" background-color="#f45e43" color="white" css-class:'mjml-tag mjml-button'>
          Don't click me!
         </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

console.log(mjml2html(mjmlString).html);
