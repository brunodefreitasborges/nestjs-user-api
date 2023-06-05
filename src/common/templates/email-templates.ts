export function passwordReset(token: string): string {
  return `<html>
            <body>
              <center>
                <div style="background-color: #d3d3d3; max-width: 840px; margin: 0; padding: 30px;">
                  <h2 style="color: #292536; text-align: center">Solicitação de alteração de senha</h2>
                  <p>Para alterar sua senha clique no botão abaixo, ou acesse o seguinte link: </p>
                  <div style="margin: 20px auto; width: 120px; padding: 10px 20px; background-color: #442d52; border-radius: 5px">
                    <a href="http://url-do-front/reset-password/?token=${token}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: #fcfcfc; font-size: 18px; margin: 0 auto;">Alterar Senha</a>
                  </div>
                </div>
              </center>
            </body>
          </html>`;
}

export function emailConfirmation(token: string): string {
  return `<html>
            <body>
              <center>
                <div style="background-color: #d3d3d3; max-width: 840px; margin: 0; padding: 30px;">
                  <h2 style="color: #292536; text-align: center">Confirme seu endereço de email</h2>
                  <p>Para confirmar seu email clique no botão abaixo, ou acesse o seguinte link: </p>
                  <div style="margin: 20px auto; width: 180px; padding: 10px 20px; background-color: #442d52; border-radius: 5px; text-align: center;">
                    <a href="http://url-do-front/email-confirmation/?token=${token}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: #fcfcfc; font-size: 18px; margin: 0 auto;">Confirmar Email</a>
                  </div>
                </div>
              </center>
            </body>
          </html>`;
}
