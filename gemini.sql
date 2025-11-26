-- TASK 1: Procedure to Update Product Description
CREATE OR REPLACE PROCEDURE PROD_NAME_UPDATE_SP (
    p_prodid IN bb_product.idproduct%TYPE,
    p_desc   IN bb_product.description%TYPE
) IS
BEGIN
    UPDATE bb_product
    SET description = p_desc
    WHERE idproduct = p_prodid;
    COMMIT;
END;
/

-- TASK 2: Procedure to Add New Product
CREATE OR REPLACE PROCEDURE PROD_ADD_SP (
    p_name   IN bb_product.productname%TYPE,
    p_desc   IN bb_product.description%TYPE,
    p_image  IN bb_product.productimage%TYPE,
    p_price  IN bb_product.price%TYPE,
    p_status IN bb_product.active%TYPE
) IS
BEGIN
    INSERT INTO bb_product (idproduct, productname, description, productimage, price, active)
    VALUES (bb_prodid_seq.NEXTVAL, p_name, p_desc, p_image, p_price, p_status);
    COMMIT;
END;
/

-- TASK 3: Procedure to Calculate Tax (Using OUT parameter for the API)
CREATE OR REPLACE PROCEDURE TAX_COST_SP (
    p_state    IN bb_tax.state%TYPE,
    p_subtotal IN bb_basket.total%TYPE,
    p_tax      OUT NUMBER
) IS
    v_taxrate bb_tax.taxrate%TYPE;
BEGIN
    SELECT taxrate INTO v_taxrate
    FROM bb_tax
    WHERE state = p_state;
    
    p_tax := p_subtotal * v_taxrate;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_tax := 0;
END;
/

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
/

-- TASK 5: Add Item to Basket
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
/

-- TASK 6: Function to Check Sale
CREATE OR REPLACE FUNCTION CK_SALE_SF (
    p_date   IN DATE,
    p_prodid IN NUMBER
) RETURN VARCHAR2 IS
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
/

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
/

-- REPORT 2: Total Spending Function
CREATE OR REPLACE FUNCTION TOT_PURCH_SF (
    p_shopperid IN NUMBER
) RETURN NUMBER IS
    v_total NUMBER := 0;
BEGIN
    SELECT SUM(total) INTO v_total
    FROM bb_basket
    WHERE idshopper = p_shopperid
    AND orderplaced = 1; -- Assuming only completed orders count
    
    RETURN NVL(v_total, 0);
EXCEPTION
    WHEN OTHERS THEN RETURN 0;
END;
/