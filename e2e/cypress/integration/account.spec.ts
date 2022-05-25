describe("Accounts API", () => {
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: "/persons",
    }).then(({ body }) => {
      body.forEach((person) => {
        cy.request({
          method: "DELETE",
          url: `/persons/${person.personId}`,
        });
      });
    });
  });

  it("/accounts/:accountId/deposit POST should deposit funds into the account", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      body: {
        name: "Test name",
        document: "test",
        birthDate: new Date().toISOString(),
      },
    })
      .then(({ body: { personId } }) => {
        expect(personId).not.to.be.empty;
        return cy.request({
          method: "POST",
          url: "/accounts",
          body: {
            personId,
            balance: 100,
            dailyWithdrawLimit: null,
            accountType: "PERSONAL",
          },
        });
      })
      .then(({ body: { accountId } }) => {
        cy.request({
          method: "POST",
          url: `/accounts/${accountId}/deposit`,
          body: {
            value: 50,
          },
        }).then(() => {
          cy.request({
            method: "GET",
            url: `/accounts/${accountId}`,
          }).then(({ body: { balance } }) => {
            expect(balance).to.be.equal(150);
          });
        });
      });
  });

  it("/accounts/:accountId/withdraw POST should withdraw funds from the account", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      body: {
        name: "Test name",
        document: "test",
        birthDate: new Date().toISOString(),
      },
    })
      .then(({ body: { personId } }) => {
        expect(personId).not.to.be.empty;
        return cy.request({
          method: "POST",
          url: "/accounts",
          body: {
            personId,
            balance: 100,
            dailyWithdrawLimit: null,
            accountType: "PERSONAL",
          },
        });
      })
      .then(({ body: { accountId } }) => {
        cy.request({
          method: "POST",
          url: `/accounts/${accountId}/withdraw`,
          body: {
            value: 50,
          },
        }).then(() => {
          cy.request({
            method: "GET",
            url: `/accounts/${accountId}`,
          }).then(({ body: { balance } }) => {
            expect(balance).to.be.equal(50);
          });
        });
      });
  });

  it("/accounts/:accountId/withdraw POST should throw an error if not enough funds", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      body: {
        name: "Test name",
        document: "test",
        birthDate: new Date().toISOString(),
      },
    })
      .then(({ body: { personId } }) => {
        expect(personId).not.to.be.empty;
        return cy.request({
          method: "POST",
          url: "/accounts",
          body: {
            personId,
            balance: 100,
            dailyWithdrawLimit: null,
            accountType: "PERSONAL",
          },
        });
      })
      .then(({ body: { accountId } }) => {
        cy.request({
          method: "POST",
          url: `/accounts/${accountId}/withdraw`,
          failOnStatusCode: false,
          body: {
            value: 150,
          },
        }).then(({ status, body }) => {
          expect(status).to.be.eq(400);
          expect(body.status).to.be.eq("insufficient_funds");
        });
      });
  });

  it("/accounts/:accountId/withdraw POST should throw an error if account is deactivated", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      body: {
        name: "Test name",
        document: "test",
        birthDate: new Date().toISOString(),
      },
    })
      .then(({ body: { personId } }) => {
        expect(personId).not.to.be.empty;
        return cy.request({
          method: "POST",
          url: "/accounts",
          body: {
            personId,
            balance: 100,
            dailyWithdrawLimit: null,
            accountType: "PERSONAL",
          },
        });
      })
      .then(({ body: { accountId } }) => {
        cy.request({
          method: "PUT",
          url: `/accounts/${accountId}/deactivate`,
        }).then(() => {
          cy.request({
            method: "POST",
            url: `/accounts/${accountId}/withdraw`,
            failOnStatusCode: false,
            body: {
              value: 150,
            },
          }).then(({ status, body }) => {
            expect(status).to.be.eq(400);
            expect(body.status).to.be.eq("account_is_deactivated");
          });
        });
      });
  });
  it("/accounts POST should create an account", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      body: {
        name: "Test name",
        document: "test",
        birthDate: new Date().toISOString(),
      },
    })
      .then(({ body: { personId } }) => {
        expect(personId).not.to.be.empty;
        return cy.request({
          method: "POST",
          url: "/accounts",
          body: {
            personId,
            balance: 100,
            dailyWithdrawLimit: 0,
            accountType: "PERSONAL",
          },
        });
      })
      .then(({ status, body: { accountId } }) => {
        expect(status).to.be.equal(201);
        expect(accountId).not.to.be.empty;
      });
  });
});
