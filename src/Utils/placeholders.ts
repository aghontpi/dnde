const columnPlaceholder = () => {
  const content = `
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
  <tbody>
    <tr>
      <td style="border: none; vertical-align: top; padding-bottom: 0px">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td
                align="center"
                draggable="false"
                id="2"
                style="font-size: 0px; padding: 10px 25px 0px; word-break: break-word; cursor: pointer; outline: unset"
              >
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="border-collapse: collapse; border-spacing: 0px"
                >
                  <tbody>
                    <tr>
                      <td>
                        <img
                          height="auto"
                          src="https://dev.bluepie.in/assets/87583817874843.svg"
                          width="Infinity"
                          style="
                            border: 0px;
                            display: block;
                            outline: none;
                            text-decoration: none;
                            height: auto;
                            width: 100%;
                            font-size: 13px;
                          "
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                draggable="false"
                id="2"
                style="
                  font-size: 0px;
                  padding: 0px 25px 10px;
                  word-break: break-word;
                  cursor: pointer;
                "
              >
                <div
                  style="
                    font-family: Ubuntu, Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1;
                    text-align: center;
                    color: rgb(0, 0, 0);
                  "
                >
                  drag and drop a content block here!
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

    `;
  return content;
};

export { columnPlaceholder };
