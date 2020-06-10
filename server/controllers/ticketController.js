const mongoose = require("mongoose"),
  Event = require("../models/event"),
  Ticket = require("../models/ticket");

exports.addTicket = async (req, res) => {
  try {
    const userId = req.body.userId,
      eventId = req.body.eventId,
      numberOfTickets = req.body.numberOfTickets,
      date = new Date();

    let soldTickets = req.body.sold_tickets;
    soldTickets += numberOfTickets;

    // Upd antal sålda biljetter
    Event.updateOne(
      { _id: eventId },
      { $set: { soldTickets: soldTickets } },
      (err) => {
        if (err) console.log(err);
      }
    );

    let tickets = [];

    for (let i = 0; i < numberOfTickets; i++) {
      const ticketNumber = Math.random()
        .toString(36)
        .substring(7);

      const ticket = new Ticket({
        ticketNumber: ticketNumber.toLocaleUpperCase(),
        eventId: eventId,
        createdAt: date,
        userId: userId,
      });

      ticket.save();

      tickets.push(ticket);
    }

    const message = {
      "Number_of_tickets: ": numberOfTickets,
      "Tickets: ": tickets,
      "Success ": true,
      "Message: ": "Here is your tickets!",
    };

    res.send(message);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
