# /////// TASKS /////// 

## TASK 1

Orginal
id: 1
name: CapressoBar Model #351

-- Testing code
SELECT * FROM bb_product;



## TASK 2
Adding a product

('Roasted Blend', 'Well-balanced mix of roasted beans, a medium body', 'roasted.jpg', 9.50, 1)


SELECT * FROM bb_product;


CALL PROD_ADD_SP ('Roasted Blend', 'Well-balanced mix of roasted beans, a medium body', 'roasted.jpg', 9.50, 1);


## TASK 3

state =
VA
NC
SC


select * from bb_tax;

DECLARE
   v_tax NUMBER;
BEGIN
   TAX_COST_SP('VA', 100, v_tax);
 DBMS_OUTPUT.PUT_LINE('Tax amount: $' || TO_CHAR(v_tax, '999.99'));
END;


## TASK 4


Basket Ids: 
3,4,12



select * from bb_basketstatus;


EXECUTE status_ship_sp(3,'20-FEB-12','UPS','ZW2384YXK4957999');
--EXECUTE status_ship_sp(3,TO_DATE('20-FEB-12', 'DD-MON-YY'),'UPS','ZW2384YXK4957');



## TASK 5

basketID: 
3-16

prodID:
2,4,6,7,8,9,10


select * from bb_basketitem;


## TASK 6

prodID:
2,4,6,7,8,9,10

10-JUN-12 and 19-JUN-12

select * from bb_product;



# /////// REPORTS ///////


## REPORTS 1

Basket Ids:
3-16


## REPORTS 2

Shooper Ids: 21-27






















style={{marginTop: '15px', padding: '10px', background: '#f0f0f0', borderRadius: '4px'}}
