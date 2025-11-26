-- TASK 1: Procedure to Update Product Name Description?
CREATE OR REPLACE PROCEDURE sp_product_update (
    p_prodid IN bb_product.idproduct%TYPE,
    --p_desc   IN bb_product.description%TYPE
    p_name   IN bb_product.productname%TYPE
) IS
BEGIN
    UPDATE bb_product
    --SET description = p_desc
    SET productname = p_name
    WHERE idproduct = p_prodid;
    COMMIT;
END;

-- Testing code
SELECT * FROM bb_product;
CALL sp_product_update(1,'CapressoBar Model #388');
-- original
EXECUTE sp_product_update(1,'CapressoBar Model #351'); 


-- TASK 2: Procedure to Add New Product
CREATE OR REPLACE PROCEDURE PROD_ADD_SP (
    p_name   IN bb_product.productname%TYPE, -- varchar
    p_desc   IN bb_product.description%TYPE, -- varchar
    p_image  IN bb_product.productimage%TYPE, --varchar
    p_price  IN bb_product.price%TYPE, --number
    p_status IN bb_product.active%TYPE -- number
) IS
BEGIN
    INSERT INTO bb_product (idproduct, productname, description, productimage, price, active)
    VALUES (bb_prodid_seq.NEXTVAL, p_name, p_desc, p_image, p_price, p_status);
    COMMIT;
END;

-- test code
SELECT * FROM bb_product;
CALL PROD_ADD_SP ('Roasted Blend', 'Well-balanced mix of roasted beans, a medium body', 'roasted.jpg', 9.50, 1);


-- TASK 3: Procedure to Calculate Tax (Using OUT parameter for the API)
CREATE OR REPLACE PROCEDURE TAX_COST_SP (
    p_state    IN bb_tax.state%TYPE,
    p_subtotal IN bb_basket.subtotal%TYPE,
    p_tax      OUT NUMBER
) IS
    v_taxrate bb_tax.taxrate%TYPE;
BEGIN
    SELECT taxrate INTO v_taxrate
    FROM bb_tax
    WHERE state = p_state;
    
    p_tax := p_subtotal * v_taxrate;

END;

-- test
--EXECUTE TAX_COST_SP ('VA', 100); 
DECLARE
   v_tax NUMBER;
BEGIN
   TAX_COST_SP('VA', 100, v_tax);
 DBMS_OUTPUT.PUT_LINE('Tax amount: $' || TO_CHAR(v_tax, '999.99'));
END;


-- TASK 4: Update Order Status
CREATE OR REPLACE PROCEDURE STATUS_SHIP_SP (
    p_basketid IN bb_basketstatus.idbasket%TYPE,
    p_date     IN DATE,
    p_shipper  IN bb_basketstatus.shipper%TYPE,
    p_track    IN bb_basketstatus.shippingnum%TYPE
) IS
BEGIN
    INSERT INTO bb_basketstatus (idstatus, idbasket, idstage, dtstage, shipper, shippingnum)
    VALUES (bb_status_seq.NEXTVAL, p_basketid, 3, p_date, p_shipper, p_track);
    COMMIT;
END;

-- test code
select * from bb_basketstatus;
EXECUTE status_ship_sp(3,'20-FEB-12','UPS','ZW2384YXK4957999');
--EXECUTE status_ship_sp(3,TO_DATE('20-FEB-12', 'DD-MON-YY'),'UPS','ZW2384YXK4957');


-- TASK 5: Add Item to Basket (all numbers)
CREATE OR REPLACE PROCEDURE BASKET_ADD_SP (
    p_basketid IN bb_basketitem.idbasket%TYPE,
    p_prodid   IN bb_basketitem.idproduct%TYPE,
    p_price    IN bb_basketitem.price%TYPE,
    p_qty      IN bb_basketitem.quantity%TYPE,
    p_size     IN bb_basketitem.option1%TYPE,
    p_form     IN bb_basketitem.option2%TYPE
) IS
BEGIN
    INSERT INTO bb_basketitem (idbasketitem, idbasket, idproduct, price, quantity, option1, option2)
    VALUES (bb_idbasketitem_seq.NEXTVAL, p_basketid, p_prodid, p_price, p_qty, p_size, p_form);
    COMMIT;
END;

-- test 
select * from bb_basketitem;
EXECUTE BASKET_ADD_SP(14,8,10.80,1,2,4);


-- TASK 6: Function to Check Sale
CREATE OR REPLACE FUNCTION CK_SALE_SF (p_date IN DATE, p_prodid IN NUMBER)
 RETURN VARCHAR2 IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM bb_product
    WHERE idproduct = p_prodid
    AND p_date BETWEEN salestart AND saleend;
    
    IF v_count > 0 THEN
        RETURN 'ON SALE!';
    ELSE
        RETURN 'Great Deal!';
    END IF;
END;
-- test 
select * from bb_product;
SELECT CK_SALE_SF('10-JUN-12', 6) FROM DUAL;
SELECT CK_SALE_SF('19-JUN-12', 6)FROM DUAL;


-- REPORT 1: Check Stock (Modified to return value to GUI instead of DBMS_OUTPUT)
CREATE OR REPLACE PROCEDURE CHECK_STOCK_SP (
    p_basketid IN NUMBER,
    p_message  OUT VARCHAR2
) IS
    CURSOR cur_basket IS
        SELECT bi.quantity, p.stock
        FROM bb_basketitem bi 
        INNER JOIN bb_product p USING (idProduct)
        WHERE bi.idBasket = p_basketid;
        
    v_all_stock CHAR(1) := 'Y';
BEGIN
    FOR rec IN cur_basket LOOP
        IF rec.stock < rec.quantity THEN
            v_all_stock := 'N';
        END IF;
    END LOOP;
    
    IF v_all_stock = 'Y' THEN
        p_message := 'All items in stock!';
    ELSE
        p_message := 'All items NOT in stock!';
    END IF;
END;


-- REPORT 2: Total Spending Function
CREATE OR REPLACE FUNCTION TOT_PURCH_SF (p_shopperid IN NUMBER)
RETURN NUMBER
IS
    v_total NUMBER := 0;
BEGIN
    SELECT SUM(total) INTO v_total
    FROM bb_basket
    WHERE idshopper = p_shopperid
    AND orderplaced = 1; -- Assuming only completed orders count
    
    RETURN NVL(v_total, 0);
-- EXCEPTION
   -- WHEN OTHERS THEN RETURN 0;
END ;


SELECT TOT_PURCH_SF(1) FROM dual;