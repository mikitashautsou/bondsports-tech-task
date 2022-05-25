describe("Persons API", () => {
  it("/persons POST, should fail when no data provided", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);

      expect(response.status).to.be.equal(400);
      expect(response.body.message).includes("name should not be empty");
      expect(response.body.message).includes("document should not be empty");
      expect(response.body.message).includes("birthDate should not be empty");
    });
  });

  it("/persons POST, should create person", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      failOnStatusCode: false,
      body: {
        name: "Test Person",
        document: "testdocumentnumber",
        birthDate: "2022-05-24T08:52:29.689Z",
      },
    }).then((response: any) => {
      expect(response.status).to.be.equal(201);
      expect(response.body.personId).not.to.be.undefined;
    });
  });

  it("/persons GET, should return persons", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      failOnStatusCode: false,
      body: {
        name: "Test Person",
        document: "testdocumentnumber",
        birthDate: "2022-05-24T08:52:29.689Z",
      },
    }).then(({ body: { personId } }) => {
      cy.request({
        method: "GET",
        url: "/persons",
      }).then((response) => {
        expect(response.body.map((e) => e.personId)).to.include(personId);
      });
    });
  });

  it("/persons DELETE, should delete person by id", () => {
    cy.request({
      method: "POST",
      url: "/persons",
      failOnStatusCode: false,
      body: {
        name: "Test Person",
        document: "testdocumentnumber",
        birthDate: "2022-05-24T08:52:29.689Z",
      },
    })
      .then(({ body }) => {
        expect(body.personId).not.to.be.undefined;
        return body.personId;
      })
      .then((personId) => {
        cy.request({
          method: "DELETE",
          url: `/persons/${personId}`,
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.be.equal(200);
          cy.request({
            method: "GET",
            url: `/persons/${personId}`,
          }).then(({ body: { status } }) => {
            expect(status).to.be.eq("person_not_found");
          });
        });
      });
  });
});

// TODO: Add test for update operation